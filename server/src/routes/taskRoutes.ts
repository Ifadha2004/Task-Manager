import express from "express";
import {
  getAllTasks, 
  getTaskById, 
  getMyTasks,
  createTask, 
  updateTask, 
  deleteTask,
} 
from "../controllers/taskController";

export const taskRouter = express.Router();

taskRouter.get("/", getAllTasks);
taskRouter.get("/mine", getMyTasks);
taskRouter.get("/:id", getTaskById);
taskRouter.post("/", createTask);
taskRouter.patch("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);
