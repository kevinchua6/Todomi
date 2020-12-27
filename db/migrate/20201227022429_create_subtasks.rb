class CreateSubtasks < ActiveRecord::Migration[6.0]
  def change
    create_table :subtasks do |t|
      t.string :text
      t.boolean :done
      t.belongs_to :todo, null: false, foreign_key: true

      t.timestamps
    end
  end
end
