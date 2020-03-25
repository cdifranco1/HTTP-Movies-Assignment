import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const initialState = {
  id: '',
  title: '',
  director: '',
  metascore: '',
  stars: ['joe', 'john', 'jack']
}

export const MovieUpdateForm = ({movieList, setMovieList}) => {
  const [ newMovie, setNewMovie ] = useState(initialState)
  const { id } = useParams()
  const history = useHistory()

  useEffect(() => {
    if (movieList.length) {
      const movie = movieList.find(e => e.id.toString() === id)
      setNewMovie(movie)
    }
  },[ movieList, id ])

  const handleChange = (e) => {
    e.persist()
    if (e.target.name === "stars"){
      const newStars = newMovie.stars.map((elem, index) => {
        if (e.target.id === index.toString()){
          return e.target.value
        } else {
          return elem
        }
      })
      setNewMovie({
        ...newMovie, 
        [e.target.name]: newStars
      })
    } else {
      setNewMovie({
        ...newMovie, 
        [e.target.name]: [
          e.target.value
        ]
      })
      console.log(newMovie)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .put(`http://localhost:5000/api/movies/${newMovie.id}`, newMovie)
      .then(res => { 
        const filteredMovieList = movieList.filter(elem => elem.id !== newMovie.id)
        setMovieList([...filteredMovieList, res.data])
      })
    history.push('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label name="title">Title: </label>
      <input name='title' type="text" value={newMovie.title} onChange={handleChange} placeholder='title'/>

      <label name="director">Director: </label>
      <input name='director' type="text" value={newMovie.director} onChange={handleChange} placeholder='director'/>

      <label name="metascore">Metascore: </label>
      <input name='metascore' type="number" value={newMovie.metascore} onChange={handleChange} placeholder='metascore'/>

      {newMovie.stars.map((e, i) =>
        <>
          <label name='stars'>{`Star ${i + 1}: `}</label> 
          <input name='stars' id={`${i}`} type="text" value={e} onChange={handleChange} placeholder='stars'/>
        </>
      )}
      <button type="submit">Update Movie</button>
    </form>
  )
}