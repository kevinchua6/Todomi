class SubtaskSerializer
  include JSONAPI::Serializer
  attributes :text, :done, :todo_id
end
