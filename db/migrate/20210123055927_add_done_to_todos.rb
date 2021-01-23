class AddDoneToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :done, :boolean
  end
end
