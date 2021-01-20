class RemoveUrgencyFromTodos < ActiveRecord::Migration[6.0]
  def change
    remove_column :todos, :urgency, :integer
  end
end
