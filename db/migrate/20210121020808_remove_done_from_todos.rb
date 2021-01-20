class RemoveDoneFromTodos < ActiveRecord::Migration[6.0]
  def change
    remove_column :todos, :done, :boolean
  end
end
