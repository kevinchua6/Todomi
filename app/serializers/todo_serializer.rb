class TodoSerializer
  include JSONAPI::Serializer
  # Remember to remove :user_id after testing is done
  attributes :title, :done, :urgency, :id, :tag, :order, :user_id

  has_many :tags
  has_many :subtasks
end
