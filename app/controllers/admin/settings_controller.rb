class Admin::SettingsController < Admin::BaseController
  before_filter :find_and_sort_templates
  clear_empty_templates_for :site, :tag_layout, :only => :update

  def update
    old_theme_path = site.current_theme_path
    if site.update_attributes params[:site]
      unless old_theme_path == site.current_theme_path
        site.change_theme_to site.current_theme_path
        flash[:notice] = "Your theme has been changed to '#{site.current_theme_path}'"
        site.expire_cached_pages self, "Expired all referenced pages"
      end
      redirect_to :action => 'index'
    else
      render :action => 'index'
    end
  end
  
  protected
    alias authorized? admin?
end
