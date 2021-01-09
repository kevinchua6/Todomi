Rails.application.routes.draw do
  devise_for :users
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

  get 'user_id' => "pages#user_id"

  resources :users do
  end

  namespace :api do
    namespace :v1 do
      resources :todos
      resources :subtasks
      resources :tags
    end
  end

  get '*path', to: 'pages#index', via: :all
end
