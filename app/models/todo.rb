class Todo < ApplicationRecord
    has_many :subtasks
    has_many :tags

    
end
