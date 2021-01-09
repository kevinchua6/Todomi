class Todo < ApplicationRecord
    has_many :subtasks
    has_many :tags

    belongs_to :user
    # validates_presence_of :user
end
