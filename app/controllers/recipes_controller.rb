class RecipesController < ApplicationController
  before_action :logged_in_user, except: [:show]
  before_action :find_recipe, except: [:index, :new, :create]
  before_action :correct_user, except: [:index, :show]

  def index
    @recipes = current_user.recipes.all
  end

  def show
    @preparation_instructions = MarkdownText.render_basic(@recipe.instructions.nil? ? "" : @recipe.instructions)
  end

  def edit
    @newingredient = Ingredient.new(recipe_id: @recipe.id)
  end

  def new
    @recipe = current_user.recipes.build()
  end

  def create
    @recipe = current_user.recipes.build(recipe_params)
    if @recipe.save
      flash[:success] = "Your recipe was successfully created"
      redirect_to edit_recipe_path(@recipe)
    else
      @newrecipe = @recipe
      render :new
    end
  end

  def update
    if @recipe.update(recipe_params)
      flash[:success] = "Recipe successfully updated"
    else
      flash[:error] = "Error updating the recipe"
    end

    # Add the new ingredient if the user passed anything
    new_ingredient_save_attempt = false
    if new_ingredient_info_passed?
      new_ingredient_save_attempt = true
      @newingredient = Ingredient.new(new_ingredient_params)
      @newingredient.recipe_id = @recipe.id
    end

    # This block allows failed attempts at adding ingredients to fail explicitly
    if new_ingredient_save_attempt
      if !@newingredient.save
        render :edit
      else
        redirect_to edit_recipe_path(@recipe)
      end
    else
      redirect_to edit_recipe_path(@recipe)
    end
  end

  def destroy
    if @recipe.destroy
      flash[:success] = "Recipe deleted"
      redirect_to recipes_path
    else
      flash.now[:error] = "Unknown error deleting recipe"
      render :edit
    end
  end

  private

  def correct_user
    return false if @recipe.nil?
    show_404("Invalid recipe...") and return false if @recipe.user != current_user
  end

  def find_recipe
    @recipe = Recipe.find_by(id: params[:id])
    show_404("Invalid recipe...") and return false if @recipe.nil?
  end

  # Only allow a trusted parameter "white list" through.
  def recipe_params
    params.require(:recipe).permit(:name, :description, :instructions, :servings)
  end

  # Same for the new ingredients
  # NOTE: We use the raw values here rather than relational links to food measurements
  # because we have another controller that deals specifically with adding food links
  def new_ingredient_params
    params.require(:newingredient).permit(:name, :calories, :fat, :carbs, :protein)
  end

  # Returns true if the user passed any new ingredient information
  def new_ingredient_info_passed?
    passed = false
    new_ingredient_params.each do |key, value|
      passed = true if !value.blank?
    end
    return passed
  end

end
