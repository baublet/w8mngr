require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module W8mngr
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    config.active_record.raise_in_transactional_callbacks = true

    # Use resque for my jobs
    config.active_job.queue_adapter = :resque

    # Adds the fonts to the assets pipeline
    config.assets.paths << Rails.root.join("app", "assets", "fonts")
    # Add our component and pages directory to assets
    config.assets.paths << Rails.root.join("app", "assets", "stylesheets", "components")
    config.assets.paths << Rails.root.join("app", "assets", "stylesheets", "pages")

    # Our validators
    config.autoload_paths << Rails.root.join("lib", "validators")
    # My custom modules
    config.autoload_paths << Rails.root.join("lib", "modules")
  end
end
