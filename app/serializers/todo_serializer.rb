class TodoSerializer
  include JSONAPI::Serializer
  # Remember to remove :user_id after testing is done
  attributes :title, :id, :tag, :user_id, :done, :subtaskno

  has_many :tags
  has_many :subtasks
end
