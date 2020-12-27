class SubtaskSerializer
  include JSONAPI::Serializer
  attributes :string, :done
end
