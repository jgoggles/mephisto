# This initializer avoids failures wen uploading images via attachment_fu
# when there is no external image library to use other than CoreImage.
# This works by removing "CoreImage" from the list of default processors that
# attachment_fu iterates over.  This avoidance is only required when the 
# rails process is ran under a forked process such as that which occurs with
# apache + Passenger + CoreImage under OSX since the Core Image APIs are not
# safe to call from a forked process and will fail.  A helpful message is
# written to the production.log during startup to indicate that image resizing
# and thumbnailing will not be performed unless one of the other image libs
# is available.

# check to see if initializer is being ran on OSX
if RUBY_PLATFORM =~ /darwin/
	# check to see if initializer is being ran from within Phusion Passenger
	caller.size.downto(0) do |i|
		if caller[i] =~ /passenger\/railz\/application_spawner\.rb:\d+:in `preload_application'/
			RAILS_DEFAULT_LOGGER.info <<-EOS
*** Monkey patching AttachmentFu to remove CoreImage image processor ***
    The CoreImage image processor is being disabled because the current 
    rails instance is running on OSX within Phusion Passenger.
    If AttachmentFu::Processors::CoreImageProcessor is used from 
    within Phusion Passenger on OSX, it will most likely cause a 
    'Premature end of script' error in the rails error log.  Additionally, a 
    'The process has forked and you cannot use this CoreFoundation functionality safely.'
    warning will be issued to your apache error log.  The CoreImageProcessor 
    can NOT be used by AttachmentFu when running within a forked process such
    as that spawned by Phusion Passenger.  If you desire image resizing and 
    thumbnailing from AttachmentFu then make sure that one of the other image 
    processors supported by AttachmentFu is installed - such as: 
      ImageScience, Rmagick, MiniMagick, and Gd2.
EOS
		
			require 'technoweenie/attachment_fu.rb'

			module Technoweenie
			  module AttachmentFu
			    @@default_processors -= ["CoreImage"]
				end
			end
			break
		end
	end
end
