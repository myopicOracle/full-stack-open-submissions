import { useState, useEffect } from "react";
// import axios from "axios";
import serverActions from "./components/AxiosFn";
import Numbers from "./components/Numbers";
import Search from "./components/Search";
import Form from "./components/Form";
import Debug from "./components/Debug";

const App = () => {
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [persons, setPersons] = useState([]);
  const [displayNames, setDisplayNames] = useState(persons);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    console.log("effect");
    serverActions
      .getNotesFromServer()
      .then((response) => {
        console.log("request successful");
        console.log(response);
        setPersons(response.data);
        setDisplayNames(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  console.log("db.json retrieved ", persons.length, "entries");

  const addNoteLocal = () => {
    setPersons((prevPerson) => {
      const newArray = [
        ...prevPerson,
        {
          name: newName,
          number: newPhone,
        },
      ];
      setDisplayNames(newArray);
      return newArray;
    });
  };

  const addNoteServer = () => {
    const newNoteObj = {
      // id: let browser auto-generate this
      name: newName,
      number: newPhone,
    };

    serverActions
      .createNote(newNoteObj)
      .then((response) => {
        console.log(response.data);
        setPersons((prev) => prev.concat(response.data));
        setDisplayNames((prev) => prev.concat(response.data));
      })
      .catch((error) => console.log(error));
  };

  const updateNumber = () => {
    window.alert(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    );

    const id = persons.find((person) => person.name === newName).id
    console.log(id);

    const newArray = persons.map((person) =>
      person.id === id
        ? {
            ...person,
            number: newPhone,
          }
        : person
    );
    console.log(newArray);

    const newNoteObj = newArray.filter(person => person.id === id)
    console.log(newNoteObj);

    serverActions.changeNote(id, newNoteObj).then((response) => {
      console.log(response.data);
      setPersons(newArray);
      setDisplayNames(newArray);
    });
  };

  const deleteNote = (id) => {
    serverActions
      .deleteNote(id)
      .then((response) => {
        console.log(response.data);
        const afterDelete = persons.filter((person) => person.id !== id);
        setPersons(afterDelete);
        setDisplayNames(afterDelete);
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    persons.some((existingPerson) => newName === existingPerson.name)
      ? updateNumber()
      : addNoteServer();
    setNewName("");
    setNewPhone("");
  };

  const handleName = (e) => {
    const input = e.target.value;
    setNewName(input);
  };

  const handlePhone = (e) => {
    const input = e.target.value;
    setNewPhone(input);
  };

  const lowerSplit = (string) => {
    const firstLowerThenSplit = string.toLowerCase().split("");
    return firstLowerThenSplit;
  };

  const handleSearch = (e) => {
    const input = e.target.value;
    console.log(input);
    setSearchInput(input);
    const inputSplit = lowerSplit(input);
    console.log(inputSplit);
    const inputLength = inputSplit.length;
    console.log(inputLength);
    const searchResults = persons.filter(
      (person) =>
        lowerSplit(person.name).slice(0, inputSplit.length).join("") ===
        inputSplit.join("")
    );
    setDisplayNames(searchResults);
  };

  return (
    <div>
      <Search searchInput={searchInput} handleSearch={handleSearch} />
      <h2>Phonebook</h2>
      <Form
        handleSubmit={handleSubmit}
        newName={newName}
        handleName={handleName}
        newPhone={newPhone}
        handlePhone={handlePhone}
      />
      <Debug newName={newName} newPhone={newPhone} />
      <h2>Numbers</h2>
      <Numbers persons={displayNames} deleteNote={deleteNote} />
    </div>
  );
};

export default App;
