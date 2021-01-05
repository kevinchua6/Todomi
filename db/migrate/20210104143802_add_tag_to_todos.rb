class AddTagToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :tag, :string
  end
end
