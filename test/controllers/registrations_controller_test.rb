require 'test_helper'

class RegistrationsControllerTest < ActionController::TestCase
  test "should get new" do
    get :new
    assert_response :success
    assert_not_nil assigns(:user)
  end

  test "should post create" do
    post :create, user: {
      email: "thisisatest@w8mngr.com",
      password: "password",
      password_confirmation: "password"
    }
    assert_response :success
    assert_not_nil assigns(:user)
  end

  test "should redirect to step 2" do
    log_in
    get :new
    assert_response :redirect
  end

  test "should get set_metrics" do
    log_in
    get :set_metrics
    assert_response :success
    assert_not_nil assigns(:user)
    assert_not_nil assigns(:weightentry)
    assert_template "metrics"
  end

  test "should post metrics" do
    log_in
    post :save_metrics, {
      height_display: "6'1\"",
      weight: "199lbs",
      birthday: "05-01-1985",
      sex: "m",
      activity: 3
    }
    assert_response :success
    assert_not_nil assigns(:user)
    assert_template "target"
  end

  test "should get target" do
    log_in
    get :set_target
    assert_response :success
    assert_template "target"
  end

  test "should post target" do
    log_in
    post :save_target, target: {
      calories: "2200"
    }
    assert_response :redirect
  end
end