class TodoSerializer
  include JSONAPI::Serializer
  attributes :title, :done, :urgency

  has_many :subtasks
end
