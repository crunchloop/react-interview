import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import Home from './components/Home'
import TodoListDetails from './components/TodoListDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todolist/:listid" element={<TodoListDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App