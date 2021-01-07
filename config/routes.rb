Rails.application.routes.draw do
  get 'tags/create'
  get 'tags/destroy'
  namespace :api do
    get 'subtasks/index'
    get 'subtasks/create'
    get 'subtasks/update'
    get 'subtasks/destroy'
  end

  get 'pages/index'
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      resources :todos
      resources :subtasks
      resources :tags
    end
  end

  get '*path', to: 'pages#index', via: :all
end
