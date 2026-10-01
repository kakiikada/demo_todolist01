import { useState } from 'react'
import './styles/App.css'

function App() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<string[]>([])
  const [completedTodos, setCompletedTodos] = useState<string[]>([])
  return (
    <main>
      <section className="content">
        <h1 className="title">ToDo List</h1>
        <form
  onSubmit={(e) => {
    e.preventDefault()
    if (!text.trim()) return
    setTodos([...todos, text])
    setText('')
  }}
        >
          <div className="addBox">
            <div className="addBox-textBox">
              <div className="textBox">
                <input type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
            <div className="addBox-btn">
              <button className="btn" type="submit">追加</button>
            </div>
          </div>
        </form>
        <div className="todoList">
          <h2>進行中のタスク</h2>
{todos.length === 0 && (
  <div>今はありません</div>
)}
          <ul className="todoList-list">
{todos.map((todo, index) => (
<li className="todoList-list_line" key={todo}>
  <div className="todoList-box">
    <div className="todoList-box_fin">
      <button className="btn"
onClick={() => {
    setTodos(todos.filter((_, i) => i !== index))
    setCompletedTodos([todo,...completedTodos])
}}
      >完了</button>
    </div>
    <div className="todoList-box_text">{todo}</div>
    <div className="todoList-box_delete">
      <button className="btn" type="button"
onClick={() => {
    setTodos(todos.filter((_, i) => i !== index))
}}
      >削除</button>
    </div>
  </div>
</li>
))}
          </ul>
        </div>
        <div className="todoList">
          <h2>完了したタスク</h2>
{completedTodos.length === 0 && (
  <div>今はありません</div>
)}
          <ul className="todoList-list">
{completedTodos.map((todo, index) => (
<li className="todoList-list_line" key={todo}>
  <div className="todoList-box">
    <div className="todoList-box_text">{todo}</div>
    <div className="todoList-box_delete">
      <button className="btn" type="button"
onClick={() => {
  setCompletedTodos(completedTodos.filter((_, i) => i !== index))
}}
      >削除</button>
    </div>
  </div>
</li>
))}

          </ul>
        </div>

      </section>
    </main>
  );
}

export default App;
