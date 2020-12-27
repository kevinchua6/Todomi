# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

todos = Todo.create([
    { 
      title: "buy milk",
      done: false,
      urgency: 3
    }, 
    {
        title: "buy dead",
        done: false,
        urgency: 2
    },
    
  ])
  
subtasks = Subtask.create([
    {
        text: "buy milks",
        done: false,
        todo: todos.first
    },
    {
        text: "buy deads",
        done: false,
        todo: todos.second
    }
])