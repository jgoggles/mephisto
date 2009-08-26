ActionController::Routing::Routes.draw do |map|
  map.test '/test', :controller => 'test', :action => 'test'
  Mephisto::Routing.connect_with map
  
end
