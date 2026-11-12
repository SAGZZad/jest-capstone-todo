
import {
  createTask,
  toggleTask,
  addTask,
  removeTask,
  findTask,
  countActive,
  summarizeTasks,
  loadTasks,
  scheduleAutosave,
} from "./todo";

// Возвращаем реальные таймеры после каждого теста
afterEach(() => {
  jest.useRealTimers();
});

// ============================================================
// 1. createTask
// ============================================================

describe("createTask", () => {
  test("создаёт активную задачу", () => {
    expect(createTask("Хлеб")).toEqual({
      title: "Хлеб",
      done: false,
    });
  });

  test.each([[""], [null], [undefined]])(
    "бросает ошибку на входе %p",
    (bad) => {
      expect(() => createTask(bad)).toThrow(
        "Название задачи обязательно"
      );
    }
  );
});

// ============================================================
// 2. toggleTask
// ============================================================

describe("toggleTask", () => {
  test("переключает статус задачи", () => {
    const task = { title: "Хлеб", done: false };

    expect(toggleTask(task)).toEqual({
      title: "Хлеб",
      done: true,
    });
  });

  test("переключает выполненную задачу обратно", () => {
    const task = { title: "Молоко", done: true };

    expect(toggleTask(task)).toEqual({
      title: "Молоко",
      done: false,
    });
  });

  test("не изменяет исходную задачу", () => {
    const task = { title: "Хлеб", done: false };

    toggleTask(task);

    expect(task).toEqual({
      title: "Хлеб",
      done: false,
    });
  });

  test("возвращает новый объект", () => {
    const task = { title: "Хлеб", done: false };

    expect(toggleTask(task)).not.toBe(task);
  });
});

// ============================================================
// 3. addTask
// ============================================================

describe("addTask", () => {
  test("добавляет новую задачу в массив", () => {
    const tasks = [{ title: "Молоко", done: false }];

    expect(addTask(tasks, "Хлеб")).toEqual([
      { title: "Молоко", done: false },
      { title: "Хлеб", done: false },
    ]);
  });

  test("не изменяет исходный массив", () => {
    const tasks = [{ title: "Молоко", done: false }];

    addTask(tasks, "Хлеб");

    expect(tasks).toEqual([
      { title: "Молоко", done: false },
    ]);
  });

  test("возвращает новый массив", () => {
    const tasks = [];

    expect(addTask(tasks, "Хлеб")).not.toBe(tasks);
  });

  test("бросает ошибку при пустом названии", () => {
    expect(() => addTask([], "")).toThrow(
      "Название задачи обязательно"
    );
  });
});

// ============================================================
// 4. removeTask
// ============================================================

describe("removeTask", () => {
  test("удаляет задачу по названию", () => {
    const tasks = [
      { title: "Хлеб", done: false },
      { title: "Молоко", done: false },
    ];

    expect(removeTask(tasks, "Хлеб")).toEqual([
      { title: "Молоко", done: false },
    ]);
  });

  test("возвращает исходные задачи, если название не найдено", () => {
    const tasks = [
      { title: "Хлеб", done: false },
    ];

    expect(removeTask(tasks, "Молоко")).toEqual(tasks);
  });

  test("не изменяет исходный массив", () => {
    const tasks = [
      { title: "Хлеб", done: false },
      { title: "Молоко", done: false },
    ];

    removeTask(tasks, "Хлеб");

    expect(tasks).toHaveLength(2);
  });

  test("удаляет все задачи с одинаковым названием", () => {
    const tasks = [
      { title: "Хлеб", done: false },
      { title: "Хлеб", done: true },
      { title: "Молоко", done: false },
    ];

    expect(removeTask(tasks, "Хлеб")).toEqual([
      { title: "Молоко", done: false },
    ]);
  });
});

// ============================================================
// 5. findTask
// ============================================================

describe("findTask", () => {
  const tasks = [
    { title: "Хлеб", done: false },
    { title: "Молоко", done: true },
  ];

  test("находит задачу по названию", () => {
    expect(findTask(tasks, "Хлеб")).toEqual({
      title: "Хлеб",
      done: false,
    });
  });

  test("возвращает undefined, если задача не найдена", () => {
    expect(findTask(tasks, "Сыр")).toBeUndefined();
  });

  test("возвращает первую задачу при совпадении названий", () => {
    const duplicated = [
      { title: "Хлеб", done: false },
      { title: "Хлеб", done: true },
    ];

    expect(findTask(duplicated, "Хлеб")).toBe(
      duplicated[0]
    );
  });
});

// ============================================================
// 6. countActive
// ============================================================

describe("countActive", () => {
  test("возвращает количество активных задач", () => {
    const tasks = [
      { title: "Хлеб", done: false },
      { title: "Молоко", done: true },
      { title: "Сыр", done: false },
    ];

    expect(countActive(tasks)).toBe(2);
  });

  test("возвращает 0 для пустого массива", () => {
    expect(countActive([])).toBe(0);
  });

  test("возвращает 0, если все задачи выполнены", () => {
    const tasks = [
      { title: "Хлеб", done: true },
      { title: "Молоко", done: true },
    ];

    expect(countActive(tasks)).toBe(0);
  });

  test("возвращает количество всех задач, если ни одна не выполнена", () => {
    const tasks = [
      { title: "Хлеб", done: false },
      { title: "Молоко", done: false },
    ];

    expect(countActive(tasks)).toBe(2);
  });
});

// ============================================================
// 7. summarizeTasks
// ============================================================

describe("summarizeTasks", () => {
  test("возвращает сводку по задачам", () => {
    const tasks = [
      { title: "Хлеб", done: false },
      { title: "Молоко", done: true },
      { title: "Сыр", done: false },
    ];

    expect(summarizeTasks(tasks)).toEqual({
      total: 3,
      active: 2,
      done: 1,
      titles: ["Хлеб", "Молоко", "Сыр"],
    });
  });

  test("создаёт снимок сводки", () => {
    const tasks = [
      { title: "Хлеб", done: false },
      { title: "Молоко", done: true },
    ];

    expect(summarizeTasks(tasks)).toMatchSnapshot();
  });

  test("возвращает пустую сводку", () => {
    expect(summarizeTasks([])).toEqual({
      total: 0,
      active: 0,
      done: 0,
      titles: [],
    });
  });
});

// ============================================================
// 8. loadTasks
// ============================================================

describe("loadTasks", () => {
  test("загружает названия и создаёт задачи", async () => {
    const api = {
      fetchTitles: jest.fn().mockResolvedValue([
        "Хлеб",
        "Молоко",
      ]),
    };

    const result = await loadTasks(api);

    expect(result).toEqual([
      { title: "Хлеб", done: false },
      { title: "Молоко", done: false },
    ]);

    expect(api.fetchTitles).toHaveBeenCalledTimes(1);
  });

  test("пробрасывает ошибку сети", async () => {
    const api = {
      fetchTitles: jest.fn().mockRejectedValue(
        new Error("Ошибка сети")
      ),
    };

    await expect(loadTasks(api)).rejects.toThrow(
      "Ошибка сети"
    );

    expect(api.fetchTitles).toHaveBeenCalledTimes(1);
  });

  test("возвращает пустой массив, если API вернул пустой список", async () => {
    const api = {
      fetchTitles: jest.fn().mockResolvedValue([]),
    };

    await expect(loadTasks(api)).resolves.toEqual([]);
  });
});

// ============================================================
// 9. scheduleAutosave
// ============================================================

describe("scheduleAutosave", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("сохраняет задачи после указанной задержки", () => {
    const storage = {
      save: jest.fn(),
    };

    const tasks = [
      { title: "Хлеб", done: false },
    ];

    scheduleAutosave(storage, tasks, 2000);

    expect(storage.save).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1999);

    expect(storage.save).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(storage.save).toHaveBeenCalledTimes(1);
    expect(storage.save).toHaveBeenCalledWith(tasks);
  });

  test("использует задержку по умолчанию 1000 мс", () => {
    const storage = {
      save: jest.fn(),
    };

    const tasks = [];

    scheduleAutosave(storage, tasks);

    jest.advanceTimersByTime(999);

    expect(storage.save).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(storage.save).toHaveBeenCalledWith(tasks);
  });

  test("возвращает идентификатор таймера", () => {
    const storage = {
      save: jest.fn(),
    };

    const timerId = scheduleAutosave(storage, []);

    expect(timerId).toBeDefined();
  });
});
