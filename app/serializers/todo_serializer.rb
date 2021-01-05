class TodoSerializer
  include JSONAPI::Serializer
  attributes :title, :done, :urgency, :id, :tag

  has_many :subtasks
end
