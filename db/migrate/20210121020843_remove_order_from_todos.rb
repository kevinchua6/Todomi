class RemoveOrderFromTodos < ActiveRecord::Migration[6.0]
  def change
    remove_column :todos, :order, :integer
  end
end
