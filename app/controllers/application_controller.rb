class ApplicationController < ActionController::Base
    before_action :authenticate_user!

    def user_id
        render json: {user_id: current_user.id}
      end

end
