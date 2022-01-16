# Todomi
Todomi is a simple todo list made with React on Rails with Typescript, and features a drag-and-drop interface.

Features include:
* Account System across devices
* Subtasks
* Tags for tasks
* Deadlines
* Task sorting using a drag and drop interface
* Search

To try it out: [todomi.herokuapp.com/](https://todomi.herokuapp.com/)

## Getting Started
### Requirements
* `ruby` (v2.7.2)
* `postgresql` (latest version)

### Setup
1. Install dependencies
```
bundle install
yarn install
```
2. Setup database
```
bundle exec rails db:create
bundle exec rails db:migrate
bundle exec rails db:seed
```
4. Run application
```
bundle exec rails s
```
