import { Injectable, inject } from '@angular/core';
import { Board, Task } from './board.model';
import { getAuth } from 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc, deleteDoc, updateDoc, arrayRemove, collection, getDocs, query, where, orderBy, runTransaction } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private db = inject(Firestore);
  private auth = getAuth();

  async createBoard(board: Board) {
    const user = this.auth.currentUser;

    return setDoc(doc(this.db, 'boards'), {
      ...board,
      uid: user?.uid,
      tasks: [{ description: 'Hello', label: 'yellow' }]
    })
  }

  async deleteBoard(boardId: string) {
    const docRef = doc(this.db, 'boards', boardId);
    return deleteDoc(docRef);
  }

  async updateTasks(boardId: string, tasks: Task[]) {
    const docRef = doc(this.db, 'boards', boardId);
    return updateDoc(docRef, {
      tasks
    })
  }

  async removeTask(boardId: string, task: Task) {
    const docRef = doc(this.db, 'boards', boardId);
    return updateDoc(docRef, {
      tasks: arrayRemove(task)
    })
  }

  async getUserBoards() {
    const user = this.auth.currentUser;
    if (!user) {
      return []
    }

    const q = query(collection(this.db, "boards"), where("uid", "==", user.uid), orderBy('priority'));
    return await getDocs(q);
  }

  async sortBoards(boards: Board[]) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const refs = boards.map(board => doc(this.db, 'boards', String(board.id)));
        refs.forEach((ref, idx) => async () => {
          const doc = await transaction.get(ref);
          if (!doc.exists()) {
            throw "Document does not exist!";
          }

          transaction.update(ref, { priority: idx });
        })
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }

  }
}
