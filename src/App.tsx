import { useEffect,useState } from 'react'
import './styles/App.css'

function App() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<string[]>([])
  const [completedTodos, setCompletedTodos] = useState<string[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  // ボタンアニメーション
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null)
  

  useEffect(() => {
    // 進行中
    //保存したストレージから値を取り出す
    const savedTodos = localStorage.getItem('todos')
    if(savedTodos){
      // 値を文字列→配列に変更して変数に入れる
      const parsedTodos = JSON.parse(savedTodos)
      // 取り出した配列をtodosにセット
      setTodos(parsedTodos)
    }
    // 完了
    //保存したストレージから値を取り出す
    const savedCompletedTodos = localStorage.getItem('completedTodos')
    if(savedCompletedTodos){
      // 値を文字列→配列に変更して変数に入れる
      const parsedCompletedTodos = JSON.parse(savedCompletedTodos)
      // 取り出した配列をcompletedTodosにセット
      setCompletedTodos(parsedCompletedTodos)
    }
    
    
  }, [])

  return (
    <main>
      <section className="content">
        <h1 className="title">ToDo List</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!text.trim()) return
            setTodos([...todos, text])
            const saveTodos = [...todos, text]
            setTodos(saveTodos)
            localStorage.setItem('todos', JSON.stringify(saveTodos))
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
        <p className="todoListHead">未完了{todos.length}件 / {todos.length + completedTodos.length}全件</p>
        <div className="todoList">
          <div className="todoList-header">
            <h2 className="todoList-header_title">進行中のタスク</h2>
            <p className="todoList-header_num">{todos.length}件</p>
          </div>
          {todos.length === 0 && (
          <div>今はありません</div>
          )}
          <ul className="todoList-list">
            {todos.map((todo, index) => (
              
            <li className={`todoList-list_line ${deletingTodo === todo ? 'ts-deleting' : ''}`} key={index}>
            {editIndex !== index ? (
              <div className="todoList-box">
                <div className="todoList-box_fin">
                  <button type="button" className="btn"
                    onClick={() => {
                      const saveTodos = todos.filter((_, i) => i !== index)
                      setTodos(saveTodos)
                      localStorage.setItem('todos', JSON.stringify(saveTodos))

                      setCompletedTodos([todo,...completedTodos])
                      const saveCompletedTodos = [todo,...completedTodos]
                      setCompletedTodos(saveCompletedTodos)
                      localStorage.setItem('completedTodos', JSON.stringify(saveCompletedTodos))
                    }}
                  >完了</button>
                </div>
                <div className="todoList-box_text">{todo}</div>
                <div className="todoList-box_edit">
                  <button className="btn btn--edit" type="button"
                    onClick={() => {
                      setEditIndex(index)
                      setEditText(todo)
                    }}
                  ></button>
                  <button className="btn btn--trash"
                  type="button"
                  onClick={() => {
                    setDeletingTodo(todo)
                    setTimeout(() => {
                      const saveTodos = todos.filter((_, i) => i !== index)
                      setTodos(saveTodos)
                      localStorage.setItem('todos', JSON.stringify(saveTodos))
                    }, 300)
                  }}
                  ></button>
                </div>
              </div>
            ):(
              <form action="">
                <div className="todoList-editBox">
                  <div className="todoList-editBox_text">
                  <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
                  </div>
                    <div className="todoList-editBox_btn">
                      <button type="button" className="btn"
                        onClick={() => {
                          if (!editText.trim()) {
                            setEditIndex(null)
                            return
                          }
                          const saveTodos = todos.map((todo, i) => {
                            if(i === editIndex){
                              return editText
                            }
                            return todo
                          })
                          setTodos(saveTodos)
                          localStorage.setItem('todos', JSON.stringify(saveTodos))
                          setEditIndex(null)
                        }}
                      >保存</button>
                    </div>
                </div>
              </form>
            )
            }
            </li>
            ))}
          </ul>
          <div className="todoList-footer">
            <button type="button" className="btn btn--trashText "
              onClick={() => {
                if(window.confirm('全てのタスクを削除します')){
                  setTodos([])
                  localStorage.setItem('todos', JSON.stringify([]))
                }
              }}
            >全削除</button>
          </div>
        </div>
        <div className="todoList">
          <div className="todoList-header">
            <h2 className="todoList-header_title">完了したタスク</h2>
            <p className="todoList-header_num">{completedTodos.length}件</p>
          </div>


          {completedTodos.length === 0 && (
            <div>今はありません</div>
          )}
          <ul className="todoList-list">
            {completedTodos.map((todo, index) => (
            <li className="todoList-list_line" key={index}>
              <div className="todoList-box">
                <div className="todoList-box_text">{todo}</div>
                <div className="todoList-box_edit">
                  <button className="btn" type="button"
                    onClick={() => {
                      const savecompletedTodos = completedTodos.filter((_, i) => i !== index)
                      setCompletedTodos(savecompletedTodos)
                      localStorage.setItem('completedTodos', JSON.stringify(savecompletedTodos))

                      setTodos([todo,...todos])
                      const savetodos = [todo,...todos]
                      setTodos(savetodos)
                      localStorage.setItem('todos', JSON.stringify(savetodos))
                    }}
                  >進行中に戻す</button>
                  <button className="btn btn--trash" type="button"
                    onClick={() => {
                      const saveCompletedTodos = completedTodos.filter((_, i) => i !== index)
                      setCompletedTodos(saveCompletedTodos)
                      localStorage.setItem('completedTodos', JSON.stringify(saveCompletedTodos))
                    }}
                  ></button>
                </div>
              </div>
            </li>
            ))}
          </ul>
          <div className="todoList-footer">
            <button type="button" className="btn btn--trashText "
              onClick={() => {
                if(window.confirm('全てのタスクを削除します')){
                  setCompletedTodos([])
                  localStorage.setItem('completedTodos', JSON.stringify([]))
                }
              }}
            >全削除</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
