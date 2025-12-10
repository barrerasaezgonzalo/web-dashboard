import { fireEvent, render, screen } from "@testing-library/react";
import Todo from "@/components/Task/Task";
import { Task, TaskProps } from "@/types";
import { DataProvider } from "@/context/DataContext";
import { DropResult } from "@hello-pangea/dnd";

const mockTasks: Task[] = [
    {
        id: "1", title: "Task 1", in_dev: false,
        order: 0
    },
    {
        id: "2", title: "Task 2", in_dev: true,
        order: 1
    },
];

const defaultProps: TaskProps = {
    tasks: mockTasks,
    addTask: jest.fn(),
    removeTask: jest.fn(),
    editTask: jest.fn(),
    toggleTaskInDev: jest.fn(),
    tasksLoading: false,
    updateTasksOrder: jest.fn(),
};

describe("Todo Component", () => {

    it("renders Skeleton when tasksLoading is true", () => {
        render(
            <DataProvider>
                <Todo {...defaultProps} tasksLoading={true} />
            </DataProvider>
        );
        expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("renders todo list title", () => {
        render(
            <DataProvider>
                <Todo {...defaultProps} />
            </DataProvider>);
        expect(screen.getByText("Lista de pendientes")).toBeInTheDocument();
    });

    it("renders tasks passed via props", () => {
        render(
            <DataProvider>
                <Todo {...defaultProps}></Todo>
            </DataProvider>
        )
        defaultProps.tasks.forEach((task) => {
            expect(screen.getByText(task.title)).toBeInTheDocument();
        });
    })

    it('call toggleTaskInDev when clicking toggle', () => {
        const toggleMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} toggleTaskInDev={toggleMock} />
            </DataProvider>
        )
        defaultProps.tasks.forEach((task, index) => {
            const checkbox = screen.getByLabelText(task.title) as HTMLInputElement;
            checkbox.click();
            expect(toggleMock).toHaveBeenNthCalledWith(index + 1, task.id);
        });
    })

    it('call addTask when clicking the add button', () => {
        const addTaskMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} addTask={addTaskMock} />
            </DataProvider>
        )
        const input = screen.getByPlaceholderText("Agregar nueva tarea");
        fireEvent.change(input, { target: { value: "new task" } })
        const button = screen.getByText('+');
        button.click();
        expect(addTaskMock).toHaveBeenCalledWith('new task')
    })

    it('call addTask when pressing enter', () => {
        const addTaskMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} addTask={addTaskMock} />
            </DataProvider>
        )
        const input = screen.getByPlaceholderText("Agregar nueva tarea");
        fireEvent.change(input, { target: { value: "new task" } })
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
        expect(addTaskMock).toHaveBeenCalledWith('new task')
    })

    it('call editTask when pressing enter', async () => {
        const editTaskMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} editTask={editTaskMock} />
            </DataProvider>
        )
        const editButton = screen.getByLabelText('Editar Task 1');
        editButton.click();
        const input = await screen.findByRole("textbox", { name: "Editar Task 1" });
        fireEvent.change(input, { target: { value: "Task 10" } })
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
        expect(editTaskMock).toHaveBeenCalledWith('1', 'Task 10')
    })

    it('call editTask when pressing save', async () => {
        const editTaskMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} editTask={editTaskMock} />
            </DataProvider>
        )
        const editButton = screen.getByLabelText('Editar Task 1');
        editButton.click();
        const input = await screen.findByRole("textbox", { name: "Editar Task 1" });
        fireEvent.change(input, { target: { value: "Task 10" } })
        const saveButton = await screen.findByLabelText('Guardar Task 1');
        saveButton.click();
        expect(editTaskMock).toHaveBeenCalledWith('1', 'Task 10')
    })

    it('call removeTask when click "si" in toast', async () => {
        const removeTaskMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} removeTask={removeTaskMock} />
            </DataProvider>
        )
        const removeButton = screen.getByLabelText('Eliminar Task 1');
        removeButton.click();
        const toast = await screen.findByTestId('toast');
        expect(toast).toBeInTheDocument();
        const confirmButton = screen.getByText('Sí');
        fireEvent.click(confirmButton);
        expect(removeTaskMock).toHaveBeenCalledWith('1');
    })

    it('not call removeTask when click "no" in toast', async () => {
        const removeTaskMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} removeTask={removeTaskMock} />
            </DataProvider>
        )
        const removeButton = screen.getByLabelText('Eliminar Task 1');
        removeButton.click();
        const toast = await screen.findByTestId('toast');
        expect(toast).toBeInTheDocument();
        const cancelButton = screen.getByText('No');
        fireEvent.click(cancelButton);
        expect(removeTaskMock).not.toHaveBeenCalled();
    })


    it("call updateTasksOrder with the correct new order when a task is dragged", () => {
        const updateTasksOrderMock = jest.fn();

        render(
            <DataProvider>
                <Todo {...defaultProps} updateTasksOrder={updateTasksOrderMock} />
            </DataProvider>
        );

        const dropResult: DropResult = {
            draggableId: "1",
            type: "DEFAULT",
            source: { index: 0, droppableId: "todos" },
            destination: { index: 1, droppableId: "todos" },
            reason: "DROP",
            mode: "FLUID",
            combine: null,
        };

        const reorderedTasks = [...mockTasks];
        const [movedItem] = reorderedTasks.splice(dropResult.source.index, 1);
        reorderedTasks.splice(dropResult.destination!.index, 0, movedItem);

        updateTasksOrderMock(reorderedTasks);

        expect(updateTasksOrderMock).toHaveBeenCalledWith([
            { id: "2", title: "Task 2", in_dev: true, order: 1 },
            { id: "1", title: "Task 1", in_dev: false, order: 0 },
        ]);
    });

    it('validate toggleTaskInDev not called when task id is missing', () => {
        const toggleMock = jest.fn();
        const taskWithoutId: Task[] = [{
            id: "", title: "Task 3", in_dev: true, order: 2
        }]
        render(
            <DataProvider>
                <Todo {...defaultProps} toggleTaskInDev={toggleMock} tasks={taskWithoutId} />
            </DataProvider>
        )

        const checkbox = screen.getByLabelText('Task 3') as HTMLInputElement;
        checkbox.click();
        expect(toggleMock).not.toHaveBeenCalled();

    })

    it('does not call addTask when input is empty', () => {
        const addTaskMock = jest.fn();
        render(
            <DataProvider>
                <Todo {...defaultProps} addTask={addTaskMock} />
            </DataProvider>
        )
        const input = screen.getByPlaceholderText("Agregar nueva tarea");
        fireEvent.change(input, { target: { value: "" } })
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
        expect(addTaskMock).not.toHaveBeenCalled();
    })

    it("applies correct background class according to in_dev", () => {
        render(
            <DataProvider>
                <Todo {...defaultProps} />
            </DataProvider>
        );

        const task1 = screen.getByText("Task 1").closest("li");
        const task2 = screen.getByText("Task 2").closest("li");

        expect(task1).toHaveClass("bg-red-300");
        expect(task2).toHaveClass("bg-blue-300");
    });
});