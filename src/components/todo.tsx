"use client"

import { Task } from "@/models/task"
import { FormEvent, useEffect, useState } from "react"
import { UserInfo, remult } from "remult";
import { TaskController } from "./TaskController";
import { signIn, signOut, useSession } from "next-auth/react";

const taskRepo = remult.repo(Task);

export default function Todo() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  const session = useSession();

  useEffect(() => {
    remult.user = session.data?.user as UserInfo;
    
    if (session?.status === 'unauthenticated') {
      signIn();
    } else if (session.status === 'authenticated') {
      taskRepo.liveQuery().subscribe((info) => setTasks(info.applyChanges))
    }


  }, [session])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const task = await taskRepo.insert({
        title: newTask
      });

      setTasks([...tasks, task]);

      setNewTask('');

     } catch(e: any) {
       alert(e.message);
     }
  }

  const setCompleteTask = async (task: Task, completed: boolean) => {
    try {
      const updatedTask = await taskRepo.save({...task, completed });

      setTasks(t => {
        return t.map(task => task.id === updatedTask.id ? updatedTask : task);
      })

     } catch(e: any) {
       alert(e.message);
     }
  }

  const deleteTask = async (task: Task) => {
    try {
      await taskRepo.delete(task);

      setTasks(t => {
        return t.filter(t => t.id !== task.id);
      })

    } catch(e: any) {
      alert(e.message);
    }
  }

  const setAllCompleted = (completed: boolean) => {
    TaskController.setAllCompleted(completed);
  }

  if (session?.status !== 'authenticated') return <></>

  return (
    <main>
      <div>
      <h1>Hello {JSON.stringify(session.data.user)}</h1>
      <button onClick={() => signOut()}>Sign out</button>
      </div>

      {taskRepo.metadata.apiInsertAllowed() && <form onSubmit={onSubmit}>
        <input 
          value={newTask}
          placeholder="What need to be done"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>}

      {tasks?.map(task => {
        return (
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={task.completed} onChange={(e) => setCompleteTask(task, e.target.checked)} />
            <h2>{task.title}</h2>
            <button className="bg-green-600 py-2 px-4" onClick={() => deleteTask(task)}>Delete</button>
          </div>
        )
      })}
      <button className="bg-green-600 text-white rounded-md p-2" onClick={() => setAllCompleted(true)}>Set All Completed</button>
      <button className="bg-red-600 text-white rounded-md p-2" onClick={() => setAllCompleted(false)}>Set All Uncompleted</button>
    </main>
  )
}