import * as uuid from 'uuid';

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/TodoAccess';
import { parseUserId } from '../auth/utils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return todoAccess.getAllTodos(userId);
}

export async function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const todoId = uuid.v4();
    const userId = parseUserId(jwtToken);

    return todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
    });
}

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await todoAccess.getTodo(todoId, userId);
    
    todoAccess.updateTodo(todo.todoId, todo.createdAt, updateTodoRequest);
}

export async function deleteTodo(todoId: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await todoAccess.getTodo(todoId, userId);

    todoAccess.deleteTodo(todo.todoId, todo.createdAt);
}

export async function setAttachmentUrl(todoId: string, attachmentUrl: string, jwtToken: string): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await todoAccess.getTodo(todoId, userId);

    todoAccess.setAttachmentUrl(todo.todoId, todo.createdAt, attachmentUrl);
}