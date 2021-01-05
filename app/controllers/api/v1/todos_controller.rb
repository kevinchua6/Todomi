class Api::V1::TodosController < ApplicationController
    protect_from_forgery with: :null_session
    
    def index
        todos = Todo.all
        render json: TodoSerializer.new(todos, options).serializable_hash.to_json
    end
  
    def show 
        todo = Todo.find(params[:id])

        render json: TodoSerializer.new(todo, options).serializable_hash.to_json
    end


    def create
        todo = Todo.new(todo_params)

        if todo.save
            render json: TodoSerializer.new(todo).serializable_hash.to_json
        else
            render json: {error: todo.error.messages }, status: 422
        end
    end

    def update
        todo = Todo.find(params[:id])

        if todo.update(todo_params)
            render json: TodoSerializer.new(todo, options).serializable_hash.to_json
        else
            render json: {error: todo.error.messages }, status: 422
        end
    end

    def destroy
        todo = Todo.find(params[:id])

        if todo.destroy
            head :no_content, status: :ok
        else
            render json: {error: todo.error.messages }, status: 422
        end
    end

    private

    def options
        @options ||= { include: %i[subtasks] }
    end

    def todo_params
        params.require(:todo).permit(:title, :done, :urgency, :tag, :order)
    end

end
