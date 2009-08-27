class FacebookConnect < ::Liquid::Tag
  def initialize(tag_name, max, tokens)
     super 
     
  end

  def render(context)
    IO.readlines('vendor/plugins/facebook_connect/facebook_connect.erb', '').to_s
  end
end
