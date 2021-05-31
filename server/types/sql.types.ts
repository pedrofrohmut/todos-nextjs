export type UserSQLType = {
  id?: string
  name?: string
  email?: string
  password_hash?: string
}

export type TaskSQLType = {
  id?: string
  name?: string
  description?: string
  created_at?: Date
  user_id?: string
}

export type TodoSQLType = {
  id?: string
  name?: string
  description?: string
  is_done?: boolean
  created_at?: Date
  task_id?: string
  user_id?: string
}
