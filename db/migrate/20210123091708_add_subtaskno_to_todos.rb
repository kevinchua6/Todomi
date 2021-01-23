class AddSubtasknoToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :subtaskno, :integer
  end
end
