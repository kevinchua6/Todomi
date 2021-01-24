class AddDateToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :date, :string
  end
end
