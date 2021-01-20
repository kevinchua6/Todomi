class Api::V1::TagsController < ApplicationController
    protect_from_forgery with: :null_session

    def create
      tag = todo.tags.new(tag_params)

        if tag.save
            render json: TagSerializer.new(tag).serializable_hash.to_json
        else
            render json: {error: tag.error.messages }, status: 422
        end
    end

    def destroy
      tag = Tag.find(params[:id])

        if tag.destroy
            head :no_content, status: :ok
        else
            render json: {error: tag.error.messages }, status: 422
        end
    end

    def todo
      @todo ||= Todo.find(params[:todo_id])
    end

    def tag_params
        params.require(:tag).permit(:name, :todo_id)
    end

end
