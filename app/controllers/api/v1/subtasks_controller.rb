class Api::V1::SubtasksController < ApplicationController
  protect_from_forgery with: :null_session

    def create
      subtask = todo.subtasks.new(subtask_params)

        if subtask.save
            render json: SubtaskSerializer.new(subtask).serializable_hash.to_json
        else
            render json: {error: subtask.error.messages }, status: 422
        end
    end

    def update
      subtask = Subtask.find(params[:id])

        if subtask.update(subtask_params)
            render json: SubtaskSerializer.new(subtask).serializable_hash.to_json
        else
            render json: {error: subtask.error.messages }, status: 422
        end
    end

    def destroy
      subtask = Subtask.find(params[:id])

        if subtask.destroy
            head :no_content, status: :ok
        else
            render json: {error: subtask.error.messages }, status: 422
        end
    end

    private

    def todo
      @todo ||= Todo.find(params[:todo_id])
    end

    def subtask_params
        params.require(:subtask).permit(:text, :done, :todo_id)
    end

end
