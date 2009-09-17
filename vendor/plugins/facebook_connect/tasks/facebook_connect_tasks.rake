namespace :facebook_connect do
  desc "Copies fbconnect.js into public/javascripts/mephisto/"
  task :install do
    file = File.dirname(__FILE__) + '/../../../../public/javascripts/mephisto/fb_comments.js'
    FileUtils.cp File.dirname(__FILE__) + '/../fb_comments.js', file unless File.exist?(file)
    puts "Plugin installed."
  end
end