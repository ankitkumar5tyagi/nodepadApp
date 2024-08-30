// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const response = await axios.get('http://localhost:5000/api/notes');
        setNotes(response.data);
    };

    const createNote = async () => {
        const response = await axios.post('http://localhost:5000/api/notes', { title, content });
        setNotes([...notes, response.data]);
        setTitle('');
        setContent('');
    };

    const updateNote = async (id) => {
        const response = await axios.put(`http://localhost:5000/api/notes/${id}`, { title, content });
        setNotes(notes.map(note => note._id === id ? response.data : note));
        setTitle('');
        setContent('');
        setEditingNote(null);
    };

    const deleteNote = async (id) => {
        await axios.delete(`http://localhost:5000/api/notes/${id}`);
        setNotes(notes.filter(note => note._id !== id));
    };

    const editNote = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNote(note._id);
    };

    const handleSubmit = () => {
        if (editingNote) {
            updateNote(editingNote);
        } else {
            createNote();
        }
    };

    return (
        <div id='main'>
            <h1>Notepad</h1>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleSubmit}>
                {editingNote ? 'Update Note' : 'Create Note'}
            </button>
            <ul>
                {notes.map(note => (
                    <li key={note._id}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <button onClick={() => editNote(note)}>Edit</button>
                        <button onClick={() => deleteNote(note._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
