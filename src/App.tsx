import { useEffect,useState } from 'react'
import './styles/App.css'

function App() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<string[]>([])
  const [completedTodos, setCompletedTodos] = useState<string[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  // ボタンアニメーション
  // 進行中
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null)
  const [deletingCompletedTodo, setDeletingCompletedTodo] = useState<string | null>(null)
  const deleteTodoAnimation = (data: string, type: 'todo' | 'completed', move: 'move' | 'delet') => {
  let setDeletingData: React.Dispatch<React.SetStateAction<string | null>>
  let datas: string[]
  let setData: React.Dispatch<React.SetStateAction<string[]>>
  let localStorageName: string

  let setDeletingData_2: React.Dispatch<React.SetStateAction<string | null>>
  let datas_2: string[]
  let setData_2: React.Dispatch<React.SetStateAction<string[]>>
  let localStorageName_2: string
    if(type == 'todo'){
      setDeletingData = setDeletingTodo
      datas = todos
      setData = setTodos
      localStorageName = 'todos'

      setDeletingData_2 = setDeletingCompletedTodo
      datas_2 = completedTodos
      setData_2 = setCompletedTodos
      localStorageName_2 = 'completedTodos'
    }else if(type == 'completed'){
      setDeletingData = setDeletingCompletedTodo
      datas = completedTodos
      setData = setCompletedTodos
      localStorageName = 'completedTodos'

      setDeletingData_2 = setDeletingTodo
      datas_2 = todos
      setData_2 = setTodos
      localStorageName_2 = 'todos'
    }else{
      return
    }
    if(move == 'delet'){
      setDeletingData(data)
      setTimeout(() => {
        const saveData = datas.filter((item) => item !== data)
        setData(saveData)
        localStorage.setItem(localStorageName, JSON.stringify(saveData))
        setDeletingData(null)
      }, 300)
    }else if(move == 'move'){
      setDeletingData(data)
      setTimeout(() => {
        const saveData = datas.filter((item) => item !== data)
        setData(saveData)
        localStorage.setItem(localStorageName, JSON.stringify(saveData))
  
        const saveData_2 = [data,...datas_2]
        setData_2(saveData_2)
        localStorage.setItem(localStorageName_2, JSON.stringify(saveData_2))
        setDeletingData(null)
      }, 300)
    }else{
      return
    }
  }

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

            // 現在は日時指定がないため、同じ内容のタスクを区別できないよう重複登録を禁止しています。日時設定を追加した場合はID指定化＋このコードを削除
            if (todos.includes(text) || completedTodos.includes(text)) {
              alert('全く同じテキストは登録できません。')
              return
            }

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
          <div className="todoList-notfound">今はありません</div>
          )}
          <ul className="todoList-list">
            {todos.map((todo, index) => (
              
            <li className={`todoList-list_line ${deletingTodo === todo ? 'ts-deleting' : ''}`} key={index}>
            {editIndex !== index ? (
              <div className="todoList-box">
                <div className="todoList-box_fin">
                  <button type="button" className="btn"
                    onClick={() => deleteTodoAnimation(todo, 'todo', 'move')}
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
                  {/* 削除 */}
                  <button className="btn btn--trash"
                  type="button"
                  onClick={() => deleteTodoAnimation(todo, 'todo', 'delet')}
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
                          // 現在は日時指定がないため、同じ内容のタスクを区別できないよう重複登録を禁止しています。
                          // 日時設定を追加した場合はID指定化＋このコードを削除
                          const newText = editText.trim()
                          if (
                            todos.some((todo, i) => todo === newText && i !== editIndex) ||
                            completedTodos.includes(newText)
                          ) {
                            alert('全く同じテキストに変更できません。')
                            return
                          }

                          const saveTodos = todos.map((todo, i) => {
                            if (i === editIndex) {
                              return newText
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
            <div className="todoList-notfound">今はありません</div>
          )}
          <ul className="todoList-list">
            {completedTodos.map((todo, index) => (
            <li className={`todoList-list_line ${deletingCompletedTodo === todo ? 'ts-deleting' : ''}`} key={index}>
              <div className="todoList-box">
                <div className="todoList-box_text">{todo}</div>
                <div className="todoList-box_edit">
                  <button className="btn" type="button"
                    onClick={() => deleteTodoAnimation(todo, 'completed', 'move')}
                  >進行中に戻す</button>
                  {/* 削除 */}
                  <button className="btn btn--trash"
                  type="button"
                    onClick={() => {deleteTodoAnimation(todo, 'completed', 'delet')}}
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
