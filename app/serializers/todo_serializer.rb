class TodoSerializer
  include JSONAPI::Serializer
  attributes :title, :done, :urgency, :id

  has_many :subtasks
end
