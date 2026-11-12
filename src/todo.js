
// ============================================================
// Модуль todo — капстоун курса Jest
// ============================================================

// Создаёт новую активную задачу
export function createTask(title) {
  if (!title) {
    throw new Error("Название задачи обязательно");
  }

  return { title, done: false };
}

// Возвращает копию задачи с изменённым статусом
export function toggleTask(task) {
  return {
    ...task,
    done: !task.done,
  };
}

// Возвращает новый массив с добавленной задачей
export function addTask(tasks, title) {
  return [...tasks, createTask(title)];
}

// Возвращает новый массив без задачи с указанным названием
export function removeTask(tasks, title) {
  return tasks.filter((task) => task.title !== title);
}

// Находит задачу по названию или возвращает undefined
export function findTask(tasks, title) {
  return tasks.find((task) => task.title === title);
}

// Считает количество невыполненных задач
export function countActive(tasks) {
  return tasks.filter((task) => !task.done).length;
}

// Возвращает сводку по задачам
export function summarizeTasks(tasks) {
  const total = tasks.length;
  const active = countActive(tasks);
  const done = total - active;
  const titles = tasks.map((task) => task.title);

  return {
    total,
    active,
    done,
    titles,
  };
}

// Загружает названия через API и создаёт задачи
export async function loadTasks(api) {
  const titles = await api.fetchTitles();

  return titles.map((title) => createTask(title));
}

// Планирует автоматическое сохранение задач
export function scheduleAutosave(storage, tasks, delay = 1000) {
  return setTimeout(() => {
    storage.save(tasks);
  }, delay);
}
