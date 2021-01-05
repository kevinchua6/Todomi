class TodoSerializer
  include JSONAPI::Serializer
  attributes :title, :done, :urgency, :id, :tag, :order

  has_many :subtasks
end
