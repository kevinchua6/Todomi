class TagSerializer
  include JSONAPI::Serializer
  attributes :name, :todo_id
end
