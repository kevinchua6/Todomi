import React, { useState, useEffect, Fragment } from "react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Subtask from "./Subtask";
import NewSubtask from "./NewSubtask";
import TextField from "@material-ui/core/TextField";
import { InputTodo } from "../Todo-Main/Todos";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Navbar from "../Shared/Navbar";
import clsx from "clsx";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import Tags from "./Tags";
import DatePicker from "./DatePicker";

const Wrapper = styled.div`
  padding-top: 20px;
  padding-bottom: 30px;
  width: 55%;
  margin: auto;
  border-radius: 20px;
`;
const Title = styled.div`
  padding-left: 5px;
  padding-bottom: 40px;
  font-size: 50px;
  font-weight: bold;
`;
const DatePickerWrapper = styled.div`
  float: right;
`;
interface Subtask {
  id: string;
  type: string;
  attributes: {
    text: string;
    done: boolean;
    todo_id: number;
  };
}
interface Tag {
  id: string;
  name: string;
  type: string;
  attributes: {
    name: string;
    todo_id: number;
  };
}
interface Todos {
  id: string;
  type: string;
  attributes: {
    title: string;
    done: boolean;
    id: number;
    tag: string;
    user_id: number;
    subtaskno: number;
  };
  relationships: {
    subtasks: {
      data: {
        id: string;
        type: string;
      }[];
    };
    tags: {
      data: {
        id: string;
        type: string;
      }[];
    };
  };
}
interface TodoI {
  match: { params: { todo_id: string } };
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  searchInput: string;

  tagsChkbox: Record<string, boolean>;
  setTagsChkbox: React.Dispatch<React.SetStateAction<{}>>;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  handleTagDelete: (tagId: string, tagName: string) => void;
  sidebarAllTodoHandleClick: () => void;
  sidebarHandleOnClick: (tagState: React.SetStateAction<{}>) => void;
  currentTab: string;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
  todos: Todos[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      padding: 44,
      paddingTop: 50,
    },
  })
);

const Todo = ({
  setSearchInput,
  searchInput,
  tagsChkbox,
  setTagsChkbox,
  tags,
  setTags,
  match,
  sidebarAllTodoHandleClick,
  sidebarHandleOnClick,
  handleTagDelete,
  currentTab,
  setCurrentTab,
  todos,
  setTodos,
}: TodoI) => {
  const { todo_id } = match.params;

  const [todo, setTodo] = useState<InputTodo>({ title: "" });

  const [debouncedTodo] = useDebounce(todo, 100);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [renderSubtasks, setRenderSubtasks] = useState<JSX.Element[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [inputSubtasks, setInputSubtasks] = useState({
    text: "",
    done: false,
    todo_id: todo_id,
  });
  const [inputTag, setInputTag] = useState({ name: "", todo_id: todo_id });
  const [todoTags, setTodoTags] = useState<Tag[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isDue, setIsDue] = useState<boolean>(false);

  const classes = useStyles();
  useEffect(() => {
    // On render gets the todo and subtask info of the specified id
    (async () => {
      const { data: rawData } = await axios.get(`/api/v1/todos/${todo_id}`);
      setTodo(rawData.data.attributes);
      const newSubtasksArr = rawData.included.filter(
        (subtask: Subtask) => subtask.type === "subtask"
      );
      setSubtasks(newSubtasksArr);
      setLoaded(true);
      const date = rawData.data.attributes.date;
      if (date !== null) {
        const newDate = new Date(date);
        setSelectedDate(new Date(date));
      }
    })();
  }, []);

  const setToStartOfDay = (date: Date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
  };

  const todayDate = new Date();

  useEffect(() => {
    if (selectedDate) {
      setToStartOfDay(selectedDate);
      setIsDue(selectedDate <= todayDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    setTodoTags(tags.filter((tag: Tag) => tag.attributes.todo_id === +todo_id));
  }, [tags]);

  const handleChangeTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, title: e.target.value });
  };

  useEffect(() => {
    // Debounced saving of todo title
    if (loaded) {
      axios
        .patch(`/api/v1/todos/${todo_id}`, { title: todo.title })
        .catch((resp) => console.log(resp));
    }
  }, [debouncedTodo]);

  const getSubtaskNo = (todos: Todos[]) => {
    let subtaskno: number;
    todos.map((todo) => {
      if (todo.id === todo_id) {
        subtaskno = todo.attributes.subtaskno;
      }
    });
    return subtaskno;
  };

  const handleNewSubtaskKeypress = (e: React.KeyboardEvent<Element>) => {
    // Does a post request of a new subtask upon pressing enter
    if (inputSubtasks.text !== "" && e.key === "Enter") {
      const newSubtaskno = getSubtaskNo(todos) + 1;
      setTodos(
        todos.map((todo) =>
          todo.id === todo_id
            ? {
                ...todo,
                attributes: { ...todo.attributes, subtaskno: newSubtaskno },
              }
            : todo
        )
      );
      axios
        .post("/api/v1/subtasks", inputSubtasks)
        .then((resp) => {
          setSubtasks(subtasks.concat([resp.data.data]));
          setInputSubtasks({ ...inputSubtasks, text: "", done: false });

          axios.patch(`/api/v1/todos/${todo_id}`, { subtaskno: newSubtaskno });
        })
        .catch((resp) => console.log(resp));
    }
  };

  const handleNewSubtaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSubtasks({ ...inputSubtasks, text: e.target.value });
  };

  const updateSubtask = (id: string, done: boolean) => {
    // When checkbox is clicked for a subtask, changes its done property
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id
          ? { ...subtask, attributes: { ...subtask.attributes, done: !done } }
          : subtask
      )
    );
  };

  const handleSubtaskDelete = (id: string) => {
    const newSubtaskno = getSubtaskNo(todos) - 1;
    setTodos(
      todos.map((todo) =>
        todo.id === todo_id
          ? {
              ...todo,
              attributes: { ...todo.attributes, subtaskno: newSubtaskno },
            }
          : todo
      )
    );

    axios
      .delete(`/api/v1/subtasks/${id}`)
      .then((resp) => {
        setSubtasks(subtasks.filter((subtask: Subtask) => subtask.id != id));
        axios.patch(`/api/v1/todos/${todo_id}`, { subtaskno: newSubtaskno });
      })
      .catch((resp) => console.log(resp));
  };

  useEffect(() => {
    // Arranges subtasks in order when `subtasks` is modified
    const undoneSubtasks: Subtask[] = subtasks
      .filter((subtask) => !subtask.attributes.done)
      .sort((a, b) => (+a.id > +b.id ? 1 : -1));
    const doneSubtasks: Subtask[] = subtasks
      .filter((subtask) => subtask.attributes.done)
      .sort((a, b) => (+a.id > +b.id ? 1 : -1));

    setRenderSubtasks(
      [...undoneSubtasks, ...doneSubtasks].map((subtask) => (
        <Subtask
          key={subtask.id}
          id={subtask.id}
          todo_id={todo.id}
          updateSubtask={updateSubtask}
          attributes={subtask.attributes}
          loaded={loaded}
          handleDelete={handleSubtaskDelete}
        />
      ))
    );
  }, [loaded, subtasks]);

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTag({ ...inputTag, name: e.target.value });
  };

  const handleNewTagKeypress = (e: React.KeyboardEvent<Element>) => {
    if ((inputTag.name !== "" && e.key === "Enter") || e.key === "Tab") {
      axios
        .post("/api/v1/tags", inputTag)
        .then((resp) => {
          setTags(tags.concat([resp.data.data]));
          setTodoTags(todoTags.concat([resp.data.data]));
          setInputTag({ ...inputTag, name: "" });
          setTagsChkbox({ ...tagsChkbox, [inputTag.name]: false });
        })
        .catch((resp) => console.log(resp));
    }
  };

  return (
    <Fragment>
      <Navbar
        setSearchInput={setSearchInput}
        searchInput={searchInput}
        items={tagsChkbox}
        allTodoHandleClick={sidebarAllTodoHandleClick}
        handleClick={sidebarHandleOnClick}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <Wrapper
        style={{
          backgroundColor: isDue ? "#ffcbcb" : "#cbe4ff",
        }}
      >
        <div className={clsx(classes.content)}>
          <Tags
            handleDelete={handleTagDelete}
            handleChange={handleNewTagChange}
            handleKeypress={handleNewTagKeypress}
            // handleClick={tagHandleClick}
            inputTag={inputTag}
            tags={todoTags}
          />
          <Link to="/">
            <ArrowBackIcon
              style={{
                fontSize: 48,
                paddingBottom: 25,
                color: "black",
              }}
            />
          </Link>
          <DatePickerWrapper>
            <DatePicker
              todo_id={todo_id}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          </DatePickerWrapper>
          <Title> Edit Task </Title>
          <TextField
            style={{
              width: "100%",
              margin: "5px 5px 25px 0",
              backgroundColor: isDue ? "#ffebeb" : "#edf5ff",
            }}
            inputProps={{ maxLength: 25 }}
            variant="outlined"
            onChange={handleChangeTodo}
            value={todo.title}
            type="text"
            name="title"
            label="Task"
          />
          <br />
          {loaded && renderSubtasks}
          <br />
          <NewSubtask
            isDue={isDue}
            inputSubtasks={inputSubtasks}
            handleNewSubtaskKeypress={handleNewSubtaskKeypress}
            handleNewSubtaskChange={handleNewSubtaskChange}
          />
        </div>
      </Wrapper>
    </Fragment>
  );
};

export default Todo;
