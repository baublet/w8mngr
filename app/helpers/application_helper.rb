require 'date'

module ApplicationHelper

    # Returns the page's full title
    def full_title(page_title = '')
        base_title = "w8mngr"
        if page_title.empty?
            base_title + " | The Lifestyle Tracker"
        else
            page_title + " | " + base_title
        end
    end

    # Returns the current day in our DB's day storage format (YYYYMMDD)
    def current_day
        if @current_day.nil?
            passed_day =    params.try(:[], :food_entry).try(:[], :day) ||
                            params.try(:[], :weight_entry).try(:[], :day) ||
                            params.try(:[], :day)
            #passed_day = ((params[:food_entry].nil?)? nil : params[:food_entry][:day]) ||
            #             ((params[:weight_entry].nil?)? nil : params[:weight_entry][:day]) ||
            #             params[:day]
            # Here, I want a date range between 1985 and 2085. If I get to be
            # 100 years old, surely someone can change this line for me...
            if passed_day.nil? || passed_day.to_i < 19850501 || passed_day.to_i > 20850501
                passed_day = Time.current.strftime('%Y%m%d')
            end
            @current_day = passed_day
        end
        return @current_day
    end

    # Returns the day before the passed day string (YYYYMMDD)
    def day_before day
      return convert_day_to_date(day).yesterday.strftime('%Y%m%d')
    end

    # Returns the day after the passed day string (YYYYMMDD)
    def day_after day
      return convert_day_to_date(day).tomorrow.strftime('%Y%m%d')
    end

    # Returns the previous day in our DB's day storage format
    def previous_day
        if @previous_day.nil?
            @previous_day = convert_day_to_date(current_day).yesterday.strftime('%Y%m%d')
        end
        return @previous_day
    end

    # Returns the next day in our DB's day storage format
    def next_day
        if @next_day.nil?
            @next_day = convert_day_to_date(current_day).tomorrow.strftime('%Y%m%d')
        end
        @next_day
    end

    # Converts YYYYMMDD to a Date object
    def convert_day_to_date string
        Date.strptime(string.to_s,"%Y%m%d")
    end

    # Converts YYYYMMDD into a nice looking date (Saturday, January 1, 2010)
    # Also accepts a date in any other format  to try to convert
    def nice_day string
        string = string.to_s
        return convert_day_to_date(string).strftime('%A, %B %e, %Y') if string.length == 8
        return Date.new(string).strftime('%A, %B %e, %Y')
    end

    # Validates a YYYYMMDD string, returning current_day if it's invalid
    # Takes either strings or ints and returns strings
    def validate_day day_string
        day_int = day_string.to_i
        if day_int > 19850501 && day_int < 20850501
            return day_string.to_s
        else
            return current_day
        end
    end

    # Converts a date to a day string
    def date_to_day date
        date = Date.parse(date) unless date.respond_to? :strftime
        return date.strftime('%Y%m%d')
    end

end
