import { useEffect,useState } from 'react'
import './styles/App.css'

type Todo = {
  id: string
  text: string
  deadline: string | null
}

function App() {
  const today = new Date().toISOString().split('T')[0]
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editDeadline, setEditDeadline] = useState('')
  const [sortOrder, setSortOrder] = useState<'none' | 'deadline'>('none')
  const [clock, setClock] = useState(new Date())
  
  // ボタンアニメーション
  // 進行中
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null)
  const [deletingCompletedTodo, setDeletingCompletedTodo] = useState<string | null>(null)
  const deleteTodoAnimation = (data: Todo, type: 'todo' | 'completed', move: 'move' | 'delet') => {
  let setDeletingData: React.Dispatch<React.SetStateAction<string | null>>
  let datas: Todo[]
  let setData: React.Dispatch<React.SetStateAction<Todo[]>>
  let localStorageName: string
  let datas_2: Todo[]
  let setData_2: React.Dispatch<React.SetStateAction<Todo[]>>
  let localStorageName_2: string
    if(type == 'todo'){
      setDeletingData = setDeletingTodo
      datas = todos
      setData = setTodos
      localStorageName = 'todos'

      datas_2 = completedTodos
      setData_2 = setCompletedTodos
      localStorageName_2 = 'completedTodos'
    }else if(type == 'completed'){
      setDeletingData = setDeletingCompletedTodo
      datas = completedTodos
      setData = setCompletedTodos
      localStorageName = 'completedTodos'

      datas_2 = todos
      setData_2 = setTodos
      localStorageName_2 = 'todos'
    }else{
      return
    }
    if(move == 'delet'){
      setDeletingData(data.id)
      setTimeout(() => {
        const saveData = datas.filter((item) => item.id !== data.id)
        setData(saveData)
        localStorage.setItem(localStorageName, JSON.stringify(saveData))
        setDeletingData(null)
      }, 300)
    }else if(move == 'move'){
      setDeletingData(data.id)
      setTimeout(() => {
        const saveData = datas.filter((item) => item.id !== data.id)
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

    // 時計
    const timer = setInterval(() => {
      setClock(new Date())
    }, 1000)

    return () => clearInterval(timer)
        
  }, [])
  // 編集後に保存する関数
  const saveEdit = () => {
    if (!editText.trim()) {
      setEditId(null)
      return
    }

    const newText = editText.trim()
    const newDate = editDeadline.trim()

    const saveTodos = todos.map((todo) => {
      if (todo.id === editId) {
        return {
          ...todo,
          text: newText,
          deadline: newDate || null
        }
      }
      return todo
    })

    setTodos(saveTodos)
    localStorage.setItem('todos', JSON.stringify(saveTodos))
    setEditId(null)
  }

  // ソート
  const sortedTodos = [...todos].sort((a, b) => {
    if (sortOrder === 'none') return 0
    // 期限がない場合を後ろに移動させる
    if (a.deadline === null) return 1
    if (b.deadline === null) return -1

    return a.deadline.localeCompare(b.deadline)
  })

  return (
    <main>
      <section className="content">
        <div className="header">
          <h1 className="header-title">ToDo List</h1>
          <div className="header-clock">
            {clock.toLocaleTimeString('ja-JP')}
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!text.trim()) return
            const newTodo: Todo = {
              id: crypto.randomUUID(),
              text: text.trim(),
              deadline: editDeadline || null
            }

            const saveTodos = [...todos, newTodo]

            setTodos(saveTodos)
            localStorage.setItem('todos', JSON.stringify(saveTodos))
            setText('')
            setEditDeadline('')
          }}
        >
          <div className="addBox">
            <ul className="addBox-textBox">
              <li className="addBox-textBox_input">
                <p className="addBox-textBox_input_title">タスク:</p>
                <input type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </li>
              <li className="addBox-textBox_input">
                <p className="addBox-textBox_input_title">期限：</p>
                <input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                />
              </li>
            </ul>
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
          <div className="todoList-sortBox">
            並び替え：
            <button className= {sortOrder === 'none' ? 'btn ts-active' : 'btn'}
              type="button"
              onClick={() => setSortOrder('none')}
            >
              登録順
            </button>

            <button className= {sortOrder === 'deadline' ? 'btn ts-active' : 'btn'}
              type="button"
              onClick={() => setSortOrder('deadline')}
            >
              期限順
            </button>
          </div>
          {todos.length === 0 && (
          <div className="todoList-notfound">今はありません</div>
          )}
          <ul className="todoList-list">
            {sortedTodos.map((todo) => (
              
            <li className={`todoList-list_line ${deletingTodo === todo.id ? 'ts-deleting' : ''}`} key={todo.id}>
            {editId !== todo.id ? (
              <div className="todoList-box">
                <div className="todoList-box_fin">
                  <button type="button" className="btn"
                    onClick={() => deleteTodoAnimation(todo, 'todo', 'move')}
                  >完了</button>
                </div>
                <p className="todoList-box_text">{todo.text}</p>
                <div className="todoList-box_edit">
                  {/* 日付け */}
                  <div className="todoList-box_edit_date">
                    <span className={
                      todo.deadline === null
                        ? ''
                        : todo.deadline < today
                          ? 'todoList-box_edit_date--red'
                          : todo.deadline === today
                            ? 'todoList-box_edit_date--yellow'
                            : ''
                      }>期限：{todo.deadline === null ? '無し' : todo.deadline.replace(/-/g, '/')}
                    </span>
                  </div>
                  {/* 編集 */}
                  <button className="btn btn--edit" type="button"
                    onClick={() => {
                      setEditId(todo.id)
                      setEditText(todo.text)
                      setEditDeadline(todo.deadline ?? '')
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
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  saveEdit()
                }}
              >
                <div className="todoList-editBox">
                  <div className="todoList-editBox_text">
                    <p className="todoList-editBox_text_title">タスク：</p>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <p className="todoList-editBox_text_title">期限：</p>
                    <input
                      type="date"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                    />
                  </div>
                  <div className="todoList-editBox_btn">
                    <button type="submit" className="btn">
                      保存
                    </button>
                  </div>
                </div>
              </form>
            )
            }
            </li>
            ))}
          </ul>

          <div className="todoList-footer">
            {todos.length !== 0 && (
              <button type="button" className="btn btn--trashText "
                onClick={() => {
                  if(window.confirm('全てのタスクを削除します')){
                    setTodos([])
                    localStorage.setItem('todos', JSON.stringify([]))
                  }
                }}
              >全削除</button>
            )}
          </div>
        </div>
        <div className="todoList">
          <div className="todoList-header">
            <h2 className="todoList-header_title">完了したタスク</h2>
            <p className="todoList-header_num">{completedTodos.length}件</p>
          </div>
          {completedTodos.length === 0 && (
            <p className="todoList-notfound">今はありません</p>
          )}
          <ul className="todoList-list">
            {completedTodos.map((todo) => (
            <li className={`todoList-list_line ${deletingCompletedTodo === todo.id ? 'ts-deleting' : ''}`} key={todo.id}>
              <div className="todoList-box">
                <p className="todoList-box_text">{todo.text}</p>
                <div className="todoList-box_edit">
                  {/* 日付け */}
                  <p className="todoList-box_edit_date">期限：<span>
                    {todo.deadline === null ? '無し' : todo.deadline.replace(/-/g, '/')}
                    </span></p>
                  {/* 編集 */}
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
            {completedTodos.length !== 0 && (
              <button type="button" className="btn btn--trashText "
                onClick={() => {
                  if(window.confirm('全てのタスクを削除します')){
                    setCompletedTodos([])
                    localStorage.setItem('completedTodos', JSON.stringify([]))
                  }
                }}
              >全削除</button>
            )}
          </div>
        </div>
        {/* 機能一覧 */}
        <div className="function">
          <h2 className="function-title">機能一覧</h2>
          <ul>
            <li>タスクの入力（タスク名・期限）</li>
            <li>登録タスクの「進行中・完了」間の移動・編集・削除</li>
            <li>全削除時のアラート</li>
            <li>タスク数の表示</li>
            <li>期限が当日であるタスク・期限が切れているタスクそれぞれの期限日の表示色を変更</li>
            <li>進行中タスクのソート</li>
            <li>時計の表示</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default App;
